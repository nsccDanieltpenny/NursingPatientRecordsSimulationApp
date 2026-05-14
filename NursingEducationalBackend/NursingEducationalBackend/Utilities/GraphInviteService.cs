using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NursingEducationalBackend.DTOs;

namespace NursingEducationalBackend.Utilities
{
    public class GraphInviteResult
    {
        public string? InviteId { get; set; }
        public string? Status { get; set; }
        public string? InviteRedeemUrl { get; set; }
        public string? Email { get; set; }
        public string? DisplayName { get; set; }
    }

    public class GraphInviteService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GraphInviteService> _logger;

        public GraphInviteService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<GraphInviteService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<(bool Success, string? ErrorMessage, GraphInviteResult? Result)> CreateGuestInvitationAsync(
            string email,
            string? displayName)
        {
            var redirectUrl = GetSetting("GraphInvite:InviteRedirectUrl");

            if (string.IsNullOrWhiteSpace(redirectUrl))
            {
                return (false, "Graph invite settings are missing.", null);
            }

            var token = await GetGraphTokenAsync();
            if (string.IsNullOrWhiteSpace(token))
            {
                return (false, "Unable to acquire Graph access token.", null);
            }

            var invitePayload = new
            {
                invitedUserEmailAddress = email,
                invitedUserDisplayName = displayName,
                inviteRedirectUrl = redirectUrl,
                sendInvitationMessage = true
            };

            var client = _httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://graph.microsoft.com/v1.0/invitations");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            request.Content = new StringContent(JsonSerializer.Serialize(invitePayload), Encoding.UTF8, "application/json");

            using var response = await client.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Graph invite failed: {Status} {Body}", response.StatusCode, responseBody);
                return (false, responseBody, null);
            }

            try
            {
                using var doc = JsonDocument.Parse(responseBody);
                var root = doc.RootElement;

                return (true, null, new GraphInviteResult
                {
                    InviteId = root.TryGetProperty("id", out var idValue) ? idValue.GetString() : null,
                    Status = root.TryGetProperty("status", out var statusValue) ? statusValue.GetString() : null,
                    InviteRedeemUrl = root.TryGetProperty("inviteRedeemUrl", out var redeemValue) ? redeemValue.GetString() : null,
                    Email = root.TryGetProperty("invitedUserEmailAddress", out var emailValue) ? emailValue.GetString() : email,
                    DisplayName = root.TryGetProperty("invitedUserDisplayName", out var nameValue) ? nameValue.GetString() : displayName
                });
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse Graph invite response.");
                return (false, "Failed to parse Graph response.", null);
            }
        }

        public async Task<(bool Success, string? ErrorMessage, List<GraphGuestUserDTO>? Users)> GetGuestUsersAsync()
        {
            var token = await GetGraphTokenAsync();
            if (string.IsNullOrWhiteSpace(token))
            {
                return (false, "Unable to acquire Graph access token.", null);
            }

            var url = "https://graph.microsoft.com/v1.0/users?$filter=userType eq 'Guest'&$select=id,displayName,mail,otherMails,userPrincipalName,userType,createdDateTime&$top=200";
            var client = _httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var response = await client.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Graph list users failed: {Status} {Body}", response.StatusCode, responseBody);
                return (false, responseBody, null);
            }

            try
            {
                using var doc = JsonDocument.Parse(responseBody);
                var root = doc.RootElement;
                if (!root.TryGetProperty("value", out var valueElement) || valueElement.ValueKind != JsonValueKind.Array)
                {
                    return (true, null, new List<GraphGuestUserDTO>());
                }

                var results = new List<GraphGuestUserDTO>();
                foreach (var user in valueElement.EnumerateArray())
                {
                    DateTime? createdDate = null;
                    if (user.TryGetProperty("createdDateTime", out var createdValue) && createdValue.ValueKind == JsonValueKind.String)
                    {
                        if (DateTime.TryParse(createdValue.GetString(), out var parsed))
                        {
                            createdDate = parsed;
                        }
                    }

                    string[]? otherMails = null;
                    if (user.TryGetProperty("otherMails", out var otherValue) && otherValue.ValueKind == JsonValueKind.Array)
                    {
                        otherMails = otherValue.EnumerateArray()
                            .Where(item => item.ValueKind == JsonValueKind.String)
                            .Select(item => item.GetString() ?? string.Empty)
                            .Where(item => !string.IsNullOrWhiteSpace(item))
                            .ToArray();
                    }

                    results.Add(new GraphGuestUserDTO
                    {
                        Id = user.TryGetProperty("id", out var idValue) ? idValue.GetString() ?? string.Empty : string.Empty,
                        DisplayName = user.TryGetProperty("displayName", out var displayValue) ? displayValue.GetString() : null,
                        Mail = user.TryGetProperty("mail", out var mailValue) ? mailValue.GetString() : null,
                        OtherMails = otherMails,
                        UserPrincipalName = user.TryGetProperty("userPrincipalName", out var upnValue) ? upnValue.GetString() : null,
                        UserType = user.TryGetProperty("userType", out var typeValue) ? typeValue.GetString() : null,
                        CreatedDateTime = createdDate
                    });
                }

                return (true, null, results);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse Graph user list response.");
                return (false, "Failed to parse Graph response.", null);
            }
        }

        public async Task<(bool Success, string? ErrorMessage)> DeleteUserAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return (false, "User ID is required.");
            }

            var token = await GetGraphTokenAsync();
            if (string.IsNullOrWhiteSpace(token))
            {
                return (false, "Unable to acquire Graph access token.");
            }

            var client = _httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Delete, $"https://graph.microsoft.com/v1.0/users/{userId}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Graph delete user failed: {Status} {Body}", response.StatusCode, responseBody);
                return (false, responseBody);
            }

            return (true, null);
        }

        private async Task<string?> GetGraphTokenAsync()
        {
            var tenantId = GetSetting("GraphInvite:TenantId");
            var clientId = GetSetting("GraphInvite:ClientId");
            var clientSecret = GetSetting("GraphInvite:ClientSecret");

            if (string.IsNullOrWhiteSpace(tenantId)
                || string.IsNullOrWhiteSpace(clientId)
                || string.IsNullOrWhiteSpace(clientSecret))
            {
                return null;
            }

            return await GetAccessTokenAsync(tenantId, clientId, clientSecret);
        }

        private async Task<string?> GetAccessTokenAsync(string tenantId, string clientId, string clientSecret)
        {
            var tokenEndpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token";
            var client = _httpClientFactory.CreateClient();

            var payload = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["scope"] = "https://graph.microsoft.com/.default",
                ["grant_type"] = "client_credentials"
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint)
            {
                Content = new FormUrlEncodedContent(payload)
            };

            using var response = await client.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Graph token request failed: {Status} {Body}", response.StatusCode, responseBody);
                return null;
            }

            try
            {
                using var doc = JsonDocument.Parse(responseBody);
                return doc.RootElement.TryGetProperty("access_token", out var tokenValue)
                    ? tokenValue.GetString()
                    : null;
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse Graph token response.");
                return null;
            }
        }

        private string? GetSetting(string key)
        {
            var value = _configuration[key];
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            var envKey = key.Replace(':', '_');
            return Environment.GetEnvironmentVariable(envKey);
        }
    }
}

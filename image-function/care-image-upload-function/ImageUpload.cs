using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace care_image_upload_function
{
    public class ImageUpload
    {
        private readonly ILogger<ImageUpload> _logger;

        public ImageUpload(ILogger<ImageUpload> logger)
        {
            _logger = logger;
        }

        [Function("ImageUpload")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            string connection = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");
            Stream blobStream = new MemoryStream();

            try
            {
                var file = req.Form.Files["image"];
                blobStream = file.OpenReadStream();

                string uniqueFileName = $"{Guid.NewGuid()}-{file.FileName}";

                var blobClient = new BlobContainerClient(connection, containerName);
                var blob = blobClient.GetBlobClient(uniqueFileName);
                await blob.UploadAsync(blobStream);

                _logger.LogInformation($"File uploaded successfully with filename: {uniqueFileName}");
                return new OkObjectResult(new { Message = "File Uploaded", FileName = uniqueFileName });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading file: {ex.Message}");
                return new BadRequestObjectResult("File upload failed.");
            }
        }

        [Function("GetImageUrl")]
        public IActionResult GetImageUrl([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetImageUrl/{fileName}")] HttpRequest req, string fileName)
        {
            string connection = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");

            try
            {
                var blobClient = new BlobContainerClient(connection, containerName);
                var blob = blobClient.GetBlobClient(fileName);

                if (!blob.Exists())
                {
                    _logger.LogWarning($"File not found: {fileName}");
                    return new NotFoundObjectResult("File not found.");
                }

                // Generate a SAS URL valid for 1 hour
                var sasUri = blob.GenerateSasUri(BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));

                _logger.LogInformation($"Generated SAS URL for file: {fileName}");
                return new OkObjectResult(new { FileName = fileName, Url = sasUri.ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating SAS URL: {ex.Message}");
                return new BadRequestObjectResult("Error generating SAS URL.");
            }
        }

        [Function("DeleteImage")]
        public async Task<IActionResult> DeleteImage([HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "DeleteImage/{fileName}")] HttpRequest req, string fileName)
        {
            string connection = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");

            try
            {
                var blobClient = new BlobContainerClient(connection, containerName);
                var blob = blobClient.GetBlobClient(fileName);

                if (!await blob.ExistsAsync())
                {
                    _logger.LogWarning($"File not found: {fileName}");
                    return new NotFoundObjectResult("File not found.");
                }

                await blob.DeleteAsync();
                _logger.LogInformation($"File deleted successfully: {fileName}");
                return new OkObjectResult(new { Message = "File Deleted", FileName = fileName });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting file: {ex.Message}");
                return new BadRequestObjectResult("Error deleting file.");
            }
        }
    }
}

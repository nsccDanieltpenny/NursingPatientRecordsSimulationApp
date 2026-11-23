namespace NursingEducationalBackend.Utilities
{
    // MAR times: the database stores UTC, but due times and dates are Atlantic (Halifax) clock times.
    public static class AtlanticTime
    {
        public static readonly TimeZoneInfo Zone = FindZone();

        private static TimeZoneInfo FindZone()
        {
            // "America/Halifax" works on Linux and most Windows; "Atlantic Standard Time" is the Windows fallback.
            foreach (var id in new[] { "America/Halifax", "Atlantic Standard Time" })
            {
                if (TimeZoneInfo.TryFindSystemTimeZoneById(id, out var zone))
                {
                    return zone;
                }
            }

            return TimeZoneInfo.Utc;
        }

        // Today's date in Halifax
        public static DateOnly Today()
        {
            return DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, Zone));
        }

        // Halifax date + clock time to UTC
        public static DateTime ToUtc(DateOnly date, TimeOnly time)
        {
            var local = DateTime.SpecifyKind(date.ToDateTime(time), DateTimeKind.Unspecified);
            if (Zone.IsInvalidTime(local))
            {
                // this clock time is skipped when the clocks spring forward
                local = local.AddHours(1);
            }
            return TimeZoneInfo.ConvertTimeToUtc(local, Zone);
        }

        // Mark dates read back from the database as UTC instead of Kind = Unspecified
        public static DateTime AsUtc(DateTime value)
        {
            return DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        public static DateTime? AsUtc(DateTime? value)
        {
            return value.HasValue ? AsUtc(value.Value) : null;
        }
    }
}

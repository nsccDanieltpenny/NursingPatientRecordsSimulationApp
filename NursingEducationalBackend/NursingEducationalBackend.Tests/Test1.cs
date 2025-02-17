using Microsoft.VisualStudio.TestTools.UnitTesting; // Important!
using NursingEducationalBackend.Models;
using System;
using System.Linq;

namespace NursingEducationalBackend.Tests
{
    [TestClass] // Important!
    public class AdlTests
    {
        private NursingDbContext _context;

        [TestInitialize] // Important!
        public void Setup()
        {
            _context = new NursingDbContext();
        }

        [TestMethod] // Important!
        public void TestAdlRetrieval()
        {
            // Act
            var adls = _context.Adls.ToList();

            // Assert
            Assert.IsNotNull(adls, "ADLs list should not be null");

            // Log results
            Console.WriteLine($"Found {adls.Count} ADL records");
            if (adls.Any())
            {
                foreach (var adl in adls)
                {
                    Console.WriteLine($"ID: {adl.AdlsId}");
                    Console.WriteLine($"Bath Date: {adl.BathData}");
                    Console.WriteLine("------------------------");
                }
            }
            else
            {
                Console.WriteLine("No ADL records found in database");
            }
        }

        [TestCleanup] // Important!
        public void Cleanup()
        {
            if (_context != null)
            {
                _context.Dispose();
            }
        }
    }
}
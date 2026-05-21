using NursingEducationalBackend.Models;
using Xunit;

namespace backend.Tests;

public class CampusTests
{
    [Fact]
    public void Campus_Properties_CanBeSetAndRead()
    {
        var campus = new Campus
        {
            CampusId = 42,
            Name = "Test Campus",
            Address = "123 Main Street"
        };

        Assert.Equal(42, campus.CampusId);
        Assert.Equal("Test Campus", campus.Name);
        Assert.Equal("123 Main Street", campus.Address);
    }

    [Fact]
    public void Campus_Classes_StartsEmpty()
    {
        var campus = new Campus();

        Assert.NotNull(campus.Classes);
        Assert.Empty(campus.Classes);
    }
}

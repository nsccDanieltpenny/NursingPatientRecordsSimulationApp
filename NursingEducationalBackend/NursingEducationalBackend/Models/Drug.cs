using System.ComponentModel.DataAnnotations;


namespace NursingEducationalBackend.Models
{
    public class Drug
    {
        [Key]
        public int DrugId { get; set; }

        public string GenericName { get; set; }
        public string BrandName { get; set; }
    }
}

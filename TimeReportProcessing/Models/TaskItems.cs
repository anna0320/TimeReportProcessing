using System.ComponentModel.DataAnnotations;

namespace TimeReportProcessing.Models
{
    public class TaskItems
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime ExecutionDate { get; set; }

        [RegularExpression(@"^([0-1][0-9]|2[0-3]):[0-5][0-9]$", ErrorMessage ="Введите время в формате ЧЧ:ММ"),Range(1, int.MaxValue, ErrorMessage = "Время должно быть больше 0!")]
        public TimeSpan TimeSpent { get; set; }

        public int UserId { get; set; }
        public Users User { get; set; }
    }
}
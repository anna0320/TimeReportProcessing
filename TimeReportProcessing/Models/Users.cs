namespace TimeReportProcessing.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string FullName { get; set; }

        public ICollection<TaskItems> TaskItems { get; set; }
    }
}

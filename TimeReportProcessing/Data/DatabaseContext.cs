using Microsoft.EntityFrameworkCore;
using TimeReportProcessing.Models;

namespace TimeReportProcessing.Data
{
    public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
    {
        public DbSet<TaskItems> TaskItems { get; set; }
        public DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItems>().Property(x => x.ExecutionDate)
                .HasColumnType("datetime");
            modelBuilder.Entity<TaskItems>().Property(x => x.TimeSpent)
                .HasColumnType("nvarchar(5)");
            modelBuilder.Entity<TaskItems>()
                .HasOne(x => x.User)
                .WithMany(x => x.TaskItems)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

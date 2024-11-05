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
            modelBuilder.Entity<Users>().ToTable("Users");
            modelBuilder.Entity<TaskItems>().ToTable("Tasks");

            modelBuilder.Entity<TaskItems>()
                .Property(t => t.ExecutionDate)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<TaskItems>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId);
        }
    }
}

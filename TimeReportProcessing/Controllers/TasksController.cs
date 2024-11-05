using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeReportProcessing.Data;
using TimeReportProcessing.Models;

namespace TimeReportProcessing.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public TasksController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetTasks()
        {
            var tasks = await _context.TaskItems
                .Select(t => new
                {
                    t.ExecutionDate,
                    t.Description,
                    TimeSpent = t.TimeSpent.ToString(@"hh\:mm"),
                    UserFullName = "Иванов И.И."
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Description) || request.TimeSpent <= TimeSpan.Zero)
                return BadRequest("Все поля должны быть заполнены, а время должно быть больше нуля.");

            var task = new TaskItems
            {
                Description = request.Description,
                ExecutionDate = DateTime.Today,
                TimeSpent = request.TimeSpent,
                UserId = 1  // Пример: текущий пользователь с ID 1
            };

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }
    }

    public class TaskRequest
    {
        public string Description { get; set; }
        public TimeSpan TimeSpent { get; set; }
    }
}
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
        public async Task<ActionResult<IEnumerable<TaskItems>>> GetTasks()
        {
            var tasks = await _context.TaskItems.Include(t => t.User).ToListAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> PostTask([FromBody] TaskItems task)
        {
            if (task.ExecutionDate.Date != DateTime.Now.Date)
            {
                return BadRequest("Дата выполнения должна быть текущей.");
            }

            if (string.IsNullOrEmpty(task.Description) || string.IsNullOrEmpty(task.TimeSpent.ToString()))
            {
                return BadRequest("Все поля обязательны для заполнения.");
            }

            // Проверка формата времени
            if (!TimeSpan.TryParse(task.TimeSpent.ToString(), out _))
            {
                return BadRequest("Неверный формат времени. Используйте HH:MM.");
            }

            task.UserId = 1; 
            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task));
        }
    }
}
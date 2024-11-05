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
            return await _context.TaskItems.Include(t => t.User).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> PostTask(TaskItems task)
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

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }
    }
}
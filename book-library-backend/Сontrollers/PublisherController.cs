using Microsoft.AspNetCore.Mvc;
using BookLibrary.Services;
using BookLibrary.Models;
using BookLibrary.Models.DTOs;

namespace BookLibrary.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublishersController : ControllerBase
    {
        private readonly IPublisherService _publisherService;

        public PublishersController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        // -------------------------------------------
        // GET: api/publishers
        // -------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Publisher>>> GetAll()
        {
            var pubs = await _publisherService.GetAllAsync();
            return Ok(pubs);
        }

        // -------------------------------------------
        // GET: api/publishers/5
        // -------------------------------------------
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Publisher>> GetById(int id)
        {
            var pub = await _publisherService.GetByIdAsync(id);
            if (pub == null) return NotFound();
            return Ok(pub);
        }

        // -------------------------------------------
        // POST: api/publishers
        // -------------------------------------------
        [HttpPost]
        public async Task<ActionResult<Publisher>> Create(Publisher publisher)
        {
            var created = await _publisherService.CreateAsync(publisher);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // -------------------------------------------
        // PUT: api/publishers/5
        // -------------------------------------------
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Publisher publisher)
        {
            var ok = await _publisherService.UpdateAsync(id, publisher);
            if (!ok) return NotFound();
            return NoContent();
        }

        // -------------------------------------------
        // DELETE: api/publishers/5
        // -------------------------------------------
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _publisherService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        // ---------------------------------------------------------
        // NEW ENDPOINT FOR AI — FIND OR CREATE PUBLISHER
        // GET: api/publishers/find?name=Oxford
        // ---------------------------------------------------------
        [HttpGet("find")]
        public async Task<ActionResult<int>> FindPublisher([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Publisher name cannot be empty.");

            // Find existing
            var existing = await _publisherService.FindByNameAsync(name);
            if (existing != null)
                return Ok(existing.Id);

            // Create new
            var created = await _publisherService.CreateAsync(new Publisher { Name = name });

            return Ok(created.Id);
        }
    }
}

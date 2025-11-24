using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;


namespace BookLibrary.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _http;

        public AiController(IHttpClientFactory httpClientFactory)
        {
            _http = httpClientFactory.CreateClient();
        }

        [HttpGet("free-books")]
        public async Task<IActionResult> GetFreeBooks([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is empty");

            var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY");

            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("Groq API key is missing. Set GROQ_API_KEY env variable.");

            var body = new
            {
                model = "llama-3.3-70b-versatile",
                messages = new[]
               {
                     new {
                         role = "user",
                         content = $@"
                         Return a list of LEGAL FREE BOOKS similar to '{query}'.
                         RETURN STRICTLY IN THIS FORMAT:
                         Title | Author | Genre | Publisher | Year | Pages | Link|
                         Examples:
                         The Hobbit | J. R. R. Tolkien | Fantasy | Allen & Unwin | 1937 | 310 | https://example.com
                         Dracula | Bram Stoker | Horror | Archibald Constable | 1897 | 418 | https://example.com

                         DO NOT add bullet points, labels, quotes or explanation."
                     }
                 }
            };
            var json = JsonSerializer.Serialize(body);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.groq.com/openai/v1/chat/completions"),
                Headers = {
                    { "Authorization", $"Bearer {apiKey}" }
                },
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            var response = await _http.SendAsync(request);

            var result = await response.Content.ReadAsStringAsync();

            return Content(result, "application/json");
        }
        [HttpGet("buy-books")]
        public async Task<IActionResult> GetBuyBooks([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query empty");

            var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("Groq API key is missing. Set GROQ_API_KEY env variable.");

            var body = new
            {
                model = "llama-3.3-70b-versatile",
                messages = new[]
                {
            new {
                role = "user",
                content = $@"
                        You are a book shopping assistant.

                        Return a list of BOOKS FOR SALE based on: '{query}'.

                        STRICT FORMAT (NO bullet points, NO quotes):

                        Title | Author | Price | Store | StoreLink | Rating | Genre | Publisher | Year

                        Stores you MUST use:
                        Amazon
                        Barnes & Noble
                        Google Books Marketplace
                        Empik
                        Yakaboo

                        Return 5–7 results."
            }
        }
            };

            var json = JsonSerializer.Serialize(body);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.groq.com/openai/v1/chat/completions"),
                Headers = {
            { "Authorization", $"Bearer {apiKey}" }
        },
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            var response = await _http.SendAsync(request);
            var result = await response.Content.ReadAsStringAsync();

            return Content(result, "application/json");
        }


    }
}

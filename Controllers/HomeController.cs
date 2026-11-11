using Microsoft.AspNetCore.Mvc;

namespace ExploradorContenidoMvc.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}

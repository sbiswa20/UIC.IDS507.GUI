using Microsoft.AspNetCore.Mvc;
using RegalRexnordHTSClassifier.Models;
using RegalRexnordHTSClassifierBusiness;
using RegalRexnordHTSClassifierBusiness.ViewModel;
using System.Diagnostics;

namespace RegalRexnordHTSClassifier.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(LoginUserModel model)
        {
            //Check if valid User or No

            bool isValidUser = false;

            RegalClassifierLoginBusiness loginBusiness = new RegalClassifierLoginBusiness();
            isValidUser = loginBusiness.VallidatedLogin(model);

            if (isValidUser)
            {
                return View("HTSClassifierView");
            }
            else
            {
                return View("Index");
            }
        
        }
            public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

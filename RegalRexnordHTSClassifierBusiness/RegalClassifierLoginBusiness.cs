using RegalRexnordHTSClassifierBusiness.ViewModel;
using RegalRexnordHTSClassifierDAO;

namespace RegalRexnordHTSClassifierBusiness
{
    public class RegalClassifierLoginBusiness
    {
        RegalClassifierLoginDAO loginDAO;

        public RegalClassifierLoginBusiness() {
            loginDAO = new RegalClassifierLoginDAO();
        }

        public bool VallidatedLogin(LoginUserModel usModel)
        {
            return loginDAO.ValidateLogin(usModel.UserName, usModel.Password);
        }

    }
}

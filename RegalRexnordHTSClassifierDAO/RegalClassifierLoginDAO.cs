using System.Data;
using System.Data.SqlClient;

namespace RegalRexnordHTSClassifierDAO
{
    public class RegalClassifierLoginDAO
    {
        public RegalClassifierLoginDAO()
        {
        }

       public bool ValidateLogin(string userName, string password)
        {

            DataTable dt = new DataTable();

            string strConString = @"Server=tcp:rrhtsclassification.database.windows.net,1433;Initial Catalog=RR_HTS_CLASSIFICATION;Persist Security Info=False;User ID=rr_hts;Password=Chicago@2024;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

            try
            {
                bool result = false;

                using (SqlConnection con = new SqlConnection(strConString))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("Select Pwd from USER_ACCESS where Emp_ID =" + userName, con);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                    
                    if (dt.Rows.Count == 1 && dt.Rows[0].ItemArray.Count() == 1  && dt.Rows[0].ItemArray[0].Equals(password))
                    {
                        result =  true;
                    }
                    

                    con.Close();
                    return result;
                }

            }
            catch(Exception ex)
            {
                throw ex;
            }
            return true;
        }
    }
}

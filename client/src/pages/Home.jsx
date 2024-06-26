import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';
import axios from "axios";
import { ToastContainer } from "react-toastify";
import TopCropCard from '../components/TopCropCard'
import RestCropCards from '../components/RestCropCards'
import '../util/config'
import { FaInstagram, FaTwitter } from 'react-icons/fa'; 
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies();
  const [username, setUsername] = useState("");
  const [iid, setIid] = useState('');
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4999",
        {},
        { withCredentials: true }
      );
      const { status, user, id } = data;
      setUsername(user);
      setIid(id);
      window.config.id = id;
      window.config.name = user;
      Cookies.set('id', id);
      Cookies.set('username', user);
      if (!status) {
        removeCookie("token");
        window.config.resetId();
        window.config.resetName();
        Cookies.remove('id');
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    // Fetch data from your API
    if (window.config.id) { // Check if window.config.id is available
      axios.post('http://localhost:4999/Cropfetch', { id: window.config.id })
        .then(response => {
          // Extract crop names from the response
          const { Crop1, Crop2, Crop3, Crop4, Crop5 } = response.data;
  
       
          const cropNames = [Crop1, Crop2, Crop3, Crop4, Crop5];
          setCrops(cropNames);
        })
        .catch(error => {
          console.error('Error fetching crops:', error);
        });
    }
  }, [window.config.id]); // Run whenever window.config.id changes
  
  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>
        <div className="card_container">
          {crops.length > 0 && <TopCropCard crop={crops[0]} />}
          {crops.length > 0 && <RestCropCards crops={crops} />}
        </div>
        <div className="container">
          <div className="heading_container">
          <h2>Need help with plant nutrition?</h2>
          </div>
         <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/w_x-WDdQdxI"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          </div>
       </div>
        <div className="footer_columns">
        <div className="contact_details">
          <p> <h3>Contact</h3></p>
          <p>Email: your@email.com</p>
          <p>Phone: +1234567890</p>
        </div>
        <div className="footer_row"></div>
          <div className="footer_column">
            <h3>Account</h3>
            <p>
              <Link to="/signup">Create an account</Link> 
            </p>
          </div>
          
          <div className="footer_column">
            <h3>Follow Us</h3>
            <p className="footer_icons">
              <a href="https://www.instagram.com">
                <FaInstagram style={{ fontSize: "24px", marginRight: "10px" }} />
              </a>
              <a href="https://www.twitter.com">
                <FaTwitter style={{ fontSize: "24px" }} />
              </a>
            </p>
          </div>
        </div>
      </div>


      <ToastContainer />
    </>
  );
};

export default Home;

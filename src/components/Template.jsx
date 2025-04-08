import Footer from "./Footer"
import Navbar from "./Navbar"
import Chatbot from "./Chatbot"

const Template = ({ children }) => {
    return (<><Navbar />{children}
          <Chatbot/>
        <Footer /></>
    )
}
export default Template
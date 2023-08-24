import "./ErrorPage.css"


export default function ErrorPage(props) {

    function redirectToLoginPage(){
        props.setDisplayErrorPage(false)
    }

    return (
        <div className={"error-page"}>
            <div className={"oops"}>Oops!</div>
            <div className={"message"}>Something went wrong...</div>
            <div id={"RedirectionDiv"} onClick={redirectToLoginPage}>Click here to log in again</div>
        </div>
    );
}
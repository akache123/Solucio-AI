import Link from "next/link"
export default function LandingPage() {
  return (
    <div>
        <header className="header">
            <div className="header-left">Solucio AI</div>
            <div className="header-right">
                <button>Log In</button>
            </div>
        </header>
        <main className="main">
            <div className="text-container">
                <h1>Get recommendations for food</h1>
                <p>Tired? Hungry? Find the dinner you want... <em>instantly.</em></p>
                <div className="buttons">
        <Link href="/dashboard">
          <div className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            Get Started
          </div>
        </Link>
      </div>
            </div>
            <div className="flex justify-end">
            <div className="w-96 h-72 bg-gray-200 border border-gray-400 rounded-lg shadow-lg">
              {/* Content of the rectangle */}
            </div>
          </div>
        </main>
        <style jsx>{`
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                height: 100vh;
                overflow: hidden; 
            }
            .header {
                background-color: #fff;
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                position: fixed;
                top: 0;
                width: 100%;
                display: flex;
                justify-content: space-between;
                z-index: 1000;
            }
            .header-left {
                font-size: 24px;
                font-weight: bold;
                padding-left: 20px;
            }
            .header-right {
                padding-right: 20px;
            }
            .header-right button {
                padding: 10px 20px;
                background-color: #333;
                color: white;
                border: none;
                cursor: pointer;
            }
            .main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: calc(100vh - 60px); 
                padding: 80px 20px 20px; 
            }
            .text-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .text-container h1 {
                font-size: 36px;
                margin-bottom: 20px;
            }
            .text-container p {
                font-size: 18px;
                margin-bottom: 20px;
            }
            .buttons {
                display: flex;
                gap: 10px;
            }
            .buttons button {
                padding: 20px;
                font-size: 24px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .image-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                max-width: 50%; 
            }
            .image-container img {
                max-width: 100%;
                max-height: 80vh; 
                height: auto;
                border-radius: 10px;
            }
        `}</style>
    </div>
);
}

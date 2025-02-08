'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import img from '/images/fbImg.png'
import img from '../../public/images/fbImg.png'
export default function Home() {
  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      {/* Hero Section with background image */}
      <header className="relative bg-white text-white text-center py-4 bg-cover bg-center" style={{ backgroundImage: 'url("https://via.placeholder.com/1920x1080")' }}>
        {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div> */}
        <div className=" w-11/12 mx-auto flex ">
          <div className="h-full w-1/2 flex flex-col items-center my-">
            <div className=" text-black w-full h-full z-10 py-20 h-full">
              <h1 className="text-4xl text-yellow-400 w-10/12 mx-auto text-center text-blue-600 font-bold leading-tight">A place to send meaningful message to your friends</h1>
              <p className=" text-center w-9/12 mx-auto my-10">Connect with your friends and family to get true feedback, build your community and deepen your interests.</p>
              <p className="mt-4 text-lg">A next-gen web app built with Next.js</p>
              <Link href="#features">
                <Button variant="outline" className="mt-6 inline-block bg-yellow-400 text-gray-800 py-2 px-6 rounded-full transform hover:scale-105 transition duration-300 hover:bg-yellow-500">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-1/2 h-full">
            <Image className=" w-full h-full" src={img} width={500} height={500} alt="img" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-8">App Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold text-yellow-500">Control Your Messaging</h3>
            <p className="mt-4">Getting messages in your control , basically you have an option whether you want to accept message from your friends</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold text-yellow-500">Get Genuine Feedback</h3>
            <p className="mt-4">Easily gather real opinions from your users to enhance your offerings and build trust.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold text-yellow-500">Get Message Suggestion</h3>
            <p className="mt-4">Generate effective message suggestions to streamline your communication and enhance user experience.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
        <div className="flex justify-center space-x-8">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-xs">
            <p className="text-lg">This app changed the way we work. Simple, powerful, and effective!</p>
            <p className="mt-4 font-semibold">- Jane Doe</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md max-w-xs">
            <p className="text-lg">An essential tool in our daily workflow. Highly recommend!</p>
            <p className="mt-4 font-semibold">- John Smith</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 Mystery Web App. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/privacy-policy">
            <div className="hover:underline">Privacy Policy</div>
          </Link>
          {" | "}
          <Link href="/terms">
            <div className="hover:underline">Terms of Service</div>
          </Link>
        </div>
      </footer>
    </div>
  );
}

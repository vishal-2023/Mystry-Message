'use client'
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"

const arr = [
  {
    img: "https://images.unsplash.com/photo-1488998287214-1e668a8e0dc4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    img: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVzc2FnZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  // {
  //   // img:"https://images.unsplash.com/photo-1569144157581-984dea473e3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lc3NhZ2V8ZW58MHx8MHx8fDA%3D"
  // },
  {
    img: "https://images.unsplash.com/photo-1569323110215-7c47e05529bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D"
  }
]

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      {/* Hero Section with background image */}
      <header className="relative bg-white text-white text-center py-4 bg-cover bg-center" style={{ backgroundImage: 'url("https://via.placeholder.com/1920x1080")' }}>
        {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div> */}
        <div className=" w-11/12 mx-auto flex ">
          <div className="h-full w-1/2 flex  flex-col items-center my-">
          <div className=" text-black w-full  h-full z-10 py-20 h-full  ">
            <h1 className="text-4xl text-yellow-400 w-10/12 mx-auto text-center text-blue-600 font-bold leading-tight">A place to send  meaningful message to your friends</h1>
            <p className=" text-center w-9/12 mx-auto my-10">Connect with your friends and family, build your community and deepen your interests.</p>
            <p className="mt-4 text-lg">A next-gen web app built with Next.js</p>
            <Link href="#features">
              <Button variant="outline" className="mt-6 inline-block bg-yellow-400 text-gray-800 py-2 px-6 rounded-full transform hover:scale-105 transition duration-300 hover:bg-yellow-500">
                Explore Features
              </Button>
            </Link>
          </div>
          </div>
          
          <div className="w-1/2 h-full">
            <img className=" w-full h-full" src="https://scontent-ord5-1.xx.fbcdn.net/v/t39.8562-6/464194964_918739083469786_5620917285767761514_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=Gd2mAzgtoM4Q7kNvgEY30RI&_nc_zt=14&_nc_ht=scontent-ord5-1.xx&_nc_gid=AuGkj32Lnr670B5qQxyfN32&oh=00_AYDoQ9JV2nvDYu2PAc5RJO4oY6bDETg2SFjD4ULyLegweQ&oe=67A4F53B" alt=" " />
          </div>
        </div>

      </header>

      {/* Carousel Section with ShadCN Carousel */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Featured Highlights</h2>
          <div className=" border">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
              opts={{
                align: "start",
              }}
              className=" mx-auto "
            >
              <CarouselContent>
                {Array.from(arr).map((data, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex h-60 border border-red-500 ">
                          <span className="text-3xl font-semibold">{index + 1}</span>
                          <img className="w=full h-full object-fill " src={data?.img} alt="" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-8">App Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold">Real-Time Messaging</h3>
            <p className="mt-4">Stay connected with friends, family, and colleagues through seamless, real-time messaging. Whether it’s a quick text, a voice message, or an important document, our app ensures that messages are delivered instantly with no delay. Share images, videos, and files effortlessly, all while enjoying a smooth, secure, and private chat experience. With end-to-end encryption, you can be confident your conversations are always safe. Plus, enjoy group chats, message reactions, and notifications so you never miss an important message.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold">Feature Two</h3>
            <p className="mt-4">Another great feature of the app that users love.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold">Feature Three</h3>
            <p className="mt-4">The third feature that makes your web app stand out in the crowd.</p>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="bg-blue-50 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
        <div className="flex justify-center space-x-8">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-xs">
            <p className="text-lg">"This app changed the way we work. Simple, powerful, and effective!"</p>
            <p className="mt-4 font-semibold">- Jane Doe</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md max-w-xs">
            <p className="text-lg">"An essential tool in our daily workflow. Highly recommend!"</p>
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

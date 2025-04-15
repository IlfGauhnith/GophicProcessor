import { WelcomeStep } from "@/components/WelcomeOverlay/WelcomeOverlay";

export const welcomeSteps: WelcomeStep[] = [
    {
      title: "Welcome to Gophic Processor!",
      titleColor: "#171717",
      subtitle: "Process your images with ease.",
      text: "Our powerful tools make image resizing and conversion simple.\n\nBuilt with Golang — engineered for **speed and concurrency** — our backend leverages **Go's full parallelism capabilities** for lightning-fast processing.\n\n\n\n\nClick 'Next' to dive deeper.",
      textColor: "#171717",
      imageUrl: "/welcome1.png",
      bgColor: "#FBE6B8",
      imageWidth: 500,
      imageHeight: 400,
    },
  
    {
      title: "Microservices in Sync",
      titleColor: "#f4f4f4",
      subtitle: "Decoupled, secure, and scalable",
      text: "Gophic Processor is built on a **microservice architecture**. The public-facing API microservice handles client requests and enforces authentication using **JWT and OAuth2**. It delegates image processing tasks to a dedicated WORKER microservice via a **RabbitMQ queue**.\n\n\nThis architecture ensures that each component can scale independently, enhancing performance and reliability.",
      textColor: "#efefef",
      imageUrl: "/welcome2.png",
      bgColor: "#1d1a2b",
      imageWidth: 1200,
      imageHeight: 600,
    },
    
    {
      title: "Optimized for Performance",
      titleColor: "#f4f4f4",
      subtitle: "Concurrency meets cloud-native storage",
      text: "The WORKER microservice spawns a thread pool matching the number of available vCPUs to process images concurrently. Upon job completion, it uploads the result to a Cloudflare R2 bucket and records metadata in PostgreSQL. Meanwhile, the frontend polls the API to track job progress in real time.\n\n\nThis design ensures efficient resource utilization and quick response times, making Gophic Processor a powerful tool for image processing.",
      textColor: "#efefef",
      imageUrl: "/welcome2.png",
      bgColor: "#1d1a2b",
      imageWidth: 1200,
      imageHeight: 600,
    },
    {
      title: "Crafted by Lucas Burle",
      titleColor: "#171717",
      subtitle: "Built with care, code, and coffee ☕",
      text: "Gophic Processor is a personal project developed by Lucas Burle, a software engineer passionate about concurrency, clean architecture, and accessible tools.\n\n[GitHub](https://github.com/IlfGauhnith) • [LinkedIn](https://www.linkedin.com/in/lucas-burle-121551165/) • [Email me](mailto:lucasbburle@gmail.com)",
      textColor: "#171717",
      imageUrl: "/welcome3.png",
      bgColor: "#FBE6B8",
      imageWidth: 500,
      imageHeight: 400,
    }
  ];
import CardEvent from "@/components/(home)/CardEvent";
import { HeroCarousel } from "@/components/(home)/HeroCarousel";

export default function Home() {
  return (
    <main>
      <div>
        <HeroCarousel/>
      </div>
      <div>
        <CardEvent/>
      </div>
    </main>
  )
}

import Link from "next/link";
import Image from "next/image";


const testimonials = [
    {
      title: "I lost 80 pounds, 20 pounds more than my goal weight!",
      text: "I lost 80 pounds over COVID with Bri’s coaching. She is compassionate but also keeps you accountable. I wouldn’t have been able to achieve this goal for myself without her guidance. I’m so grateful for her help.",
      name: "Jessica, Client",
    },
    {
      title: "So much clarity!",
      text: "Bri and I went on a grocery shopping tour. It gave me so much clarity and confidence to go shopping on my own.",
      name: "Leslie, Client",
    },
    {
      title: "I can bake and not binge!",
      text: "I love baking. Working with Bri has taught me that I can love baking and not overindulge on my own creations. I now give them away to friends and they love my baking too!",
      name: "Tamara, Client",
    },
    {
      title: "Now I have a better relationship with food!",
      text: "I’ve always had a horrible relationship with food and my body. Bri has taught me to see food as fuel and how to add movement into my daily routine. I love the replays when I can’t make live classes.",
      name: "Audrey, Client and Reset Studio Member",
    },
    {
      title: "No more leg pain!",
      text: "Before working with Brianna I was dealing with constant pain. Brianna makes our classes just what I need to manage my chronic pain. I can also feel circulation in my legs again!",
      name: "Riviera, Yoga Student",
    },
    {
      title: "We feel like we did when we got married!",
      text: "My wife and I ate healthy in our youth and then when we had kids we kind of fell off. When we worked with Bri, I lost over 25 pounds and my wife hit her goal. We gained time back with each other by making workouts a family activity.",
      name: "Ty, Client",
    },
    {
      title: "She’s so motivational and fun!",
      text: "I took the 6 week challenge with Bri. I loved the daily accountability texts. She’s so motivational and I was really inspired to finish the challenge strong.",
      name: "Deanna, Client",
    },
    {
      title: "Now I actually exercise!",
      text: "Working with Bri helped me to include exercise into my day and I now think differently about the foods I eat.",
      name: "Whitney, Client",
    },
    {
      title: "I hit my goal and maintained!",
      text: "Bri helped me hit my goal and I stayed on with her for maintenance coaching to help in that first year after the weight loss. My daughter got married within that time and Bri helped me stay on track so I looked and felt fabulous in my MOB dress. She is amazing and super encouraging.",
      name: "Michelle, Client",
    },
  ];
  
export default function Testimonials() {
    return (
      <section id="testimonials" className="bg-brand-soft px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-script text-5xl text-brand-pink">Kind Words</p>
  
            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
              Real women. Real lives. Real results.
            </h2>
          </div>
  
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.title}
                className="bg-white p-8 shadow-soft"
              >
                <h3 className="font-serifDisplay text-3xl leading-tight text-brand-coral">
                  {testimonial.title}
                </h3>
  
                <p className="mt-6 leading-8 text-brand-green/75">
                  {testimonial.text}
                </p>
  
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-brand-green/50">
                  {testimonial.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
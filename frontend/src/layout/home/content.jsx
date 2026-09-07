import React from "react";

const Content = () => {
  const steps = [
    {
      img: "/pt1.webp",
      title: "1. Add your trip details",
      desc: "Enter your pickup spot and destination, and check prices.",
    },
    {
      img: "/pt2.webp",
      title: "2. Pay easily",
      desc: "Add your preferred payment method and choose ride option.",
    },
    {
      img: "/pt3.webp",
      title: "3. Meet your driver",
      desc: "Uber will match you with a nearby driver.",
    },
  ];

  return (
    <section className="bg-white py-20 px-4 md:px-20 ">
      <div className="max-w-6xl mx-auto lg:pt-[150px]">

        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Book your trip on your phone or computer
        </h2>

        {/* STEPS */}
        <div className="space-y-16">

          {steps.map((step, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {/* IMAGE */}
              <img
                src={step.img}
                className="w-full md:w-[420px] rounded shadow"
              />

              {/* TEXT */}
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Content;
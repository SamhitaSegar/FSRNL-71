export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="container-x">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-r from-brand to-brand-light px-8 py-12 text-center text-white shadow-soft md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to order your favorite meal?
            </h2>
            <p className="mt-2 text-white/90">
              Get 20% off on your first order. Use code <strong>FOODIE20</strong> at checkout.
            </p>
          </div>
          <a href="#menu" className="btn-light btn-lg whitespace-nowrap">Order Now</a>
        </div>
      </div>
    </section>
  )
}

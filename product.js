// ---------- Step 3: A Product class ----------
export class Product {
  constructor(name, price, image = "") {
    this.name = name;
    this.price = price;
    this.image = image;
  }

  withTax() {
    return this.price * 1.16;
  }
}

let cart = [];
let cartTotal = 0;
const cartDom = document.querySelector(".cart");
const addtocartbtnDom = document.querySelectorAll(
  '[data-action="add-to-cart"]'
);

addtocartbtnDom.forEach((addtocartbtnDom) => {
  addtocartbtnDom.addEventListener("click", () => {
    const productDom = addtocartbtnDom.parentNode.parentNode;
    const product = {
      img: productDom.querySelector(".product-img").getAttribute("src"),
      name: productDom.querySelector(".product-name").innerText,
      price: productDom.querySelector(".product-price").innerText,
      quantity: 1,
    };

    const IsinCart =
      cart.filter((cartItem) => cartItem.name === product.name).length > 0;
    if (IsinCart === false) {
      cartDom.insertAdjacentHTML(
        "beforeend",
        `
  <div class="d-flex flex-row shadow-sm card cart-items mt-2 mb-3 animated flipInX">
    <div class="p-2">
        <img src="${product.img}" alt="${product.name}" style="max-width: 50px;"/>
    </div>
    <div class="p-2 mt-3">
        <p class="text-info cart_item_name">${product.name}</p>
    </div>
    <div class="p-2 mt-3">
        <p class="text-success cart_item_price">${product.price}</p>
    </div>
    <div class="p-2 mt-3 ml-auto">
        <button class="btn badge badge-secondary" type="button" data-action="increase-item">&plus;
    </div>
    <div class="p-2 mt-3">
      <p class="text-success cart_item_quantity">${product.quantity}</p>
    </div>
    <div class="p-2 mt-3">
      <button class="btn badge badge-info" type="button" data-action="decrease-item">&minus;
    </div>
    <div class="p-2 mt-3">
      <button class="btn badge badge-danger" type="button" data-action="remove-item">&times;
    </div>
  </div> `
      );

      if (document.querySelector(".cart-footer") === null) {
        cartDom.insertAdjacentHTML(
          "afterend",
          `
      <div class="d-flex flex-row shadow-sm card cart-footer mt-2 mb-3 animated flipInX">
        <div class="p-2">
          <button class="btn badge-danger" type="button" data-action="clear-cart">Clear Cart
        </div>
        <div class="p-2 ml-auto">
          <button class="btn badge-dark" type="button" data-action="check-out">Pay <span class="pay"></span> 
            &#10137;
        </div>
      </div>`
        );
      }

      addtocartbtnDom.innerText = "In cart";
      addtocartbtnDom.disabled = true;
      cart.push(product);

      const cartItemsDom = cartDom.querySelectorAll(".cart-items");
      cartItemsDom.forEach((cartItemDom) => {
        if (
          cartItemDom.querySelector(".cart_item_name").innerText ===
          product.name
        ) {
          cartTotal +=
            parseInt(
              cartItemDom.querySelector(".cart_item_quantity").innerText
            ) *
            parseInt(cartItemDom.querySelector(".cart_item_price").innerText);
          document.querySelector(".pay").innerText = cartTotal + " tk.";

          // increase item in cart
          cartItemDom
            .querySelector('[data-action="increase-item"]')
            .addEventListener("click", () => {
              cart.forEach((cartItem) => {
                if (cartItem.name === product.name) {
                  cartItemDom.querySelector(".cart_item_quantity").innerText =
                    ++cartItem.quantity;
                  cartItemDom.querySelector(".cart_item_price").innerText =
                    parseInt(cartItem.quantity) * parseInt(cartItem.price) +
                    " tk.";
                  cartTotal += parseInt(cartItem.price);
                  document.querySelector(".pay").innerText = cartTotal + " tk.";
                }
              });
            });

          // decrease item in cart
          cartItemDom
            .querySelector('[data-action="decrease-item"]')
            .addEventListener("click", () => {
              cart.forEach((cartItem) => {
                if (cartItem.name === product.name) {
                  if (cartItem.quantity > 1) {
                    cartItemDom.querySelector(".cart_item_quantity").innerText =
                      --cartItem.quantity;
                    cartItemDom.querySelector(".cart_item_price").innerText =
                      parseInt(cartItem.quantity) * parseInt(cartItem.price) +
                      " tk.";
                    cartTotal -= parseInt(cartItem.price);
                    document.querySelector(".pay").innerText =
                      cartTotal + " tk.";
                  }
                }
              });
            });

          //remove item from cart
          cartItemDom
            .querySelector('[data-action="remove-item"]')
            .addEventListener("click", () => {
              cart.forEach((cartItem) => {
                if (cartItem.name === product.name) {
                  cartTotal -= parseInt(
                    cartItemDom.querySelector(".cart_item_price").innerText
                  );
                  document.querySelector(".pay").innerText = cartTotal + " tk.";
                  cartItemDom.remove();
                  cart = cart.filter(
                    (cartItem) => cartItem.name !== product.name
                  );
                  addtocartbtnDom.innerText = "Add to cart";
                  addtocartbtnDom.disabled = false;
                }
                if (cart.length < 1) {
                  document.querySelector(".cart-footer").remove();
                }
              });
            });

          //clear cart
          document
            .querySelector('[data-action="clear-cart"]')
            .addEventListener("click", () => {
              cartItemDom.remove();
              cart = [];
              cartTotal = 0;
              if (document.querySelector(".cart-footer") !== null) {
                document.querySelector(".cart-footer").remove();
              }
              addtocartbtnDom.innerText = "Add to cart";
              addtocartbtnDom.disabled = false;
            });

          document
            .querySelector('[data-action="check-out"]')
            .addEventListener("click", () => {
              if (document.getElementById("paypal-form") === null) {
                checkOut();
              }
            });
        }
      });
    }
  });
});

function purify(img) {
  img.classList.add("animated", "shake");
}

function normalImg(img) {
  img.classList.remove("animated", "shake");
}

function checkOut() {
  let paypalHTMLForm = `
  <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" >
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="upload" value="1">
    <input type="hidden" name="business" value="gmanish478@gmail.com">
    <input type="hidden" name="currency_code" value="INR">`;

  cart.forEach((cartItem, index) => {
    ++index;
    paypalHTMLForm += ` <input type="hidden" name="item_name_${index}" value="${
      cartItem.name
    }">
    <input type="hidden" name="amount_${index}" value="${cartItem.price.replace(
      "Rs.",
      ""
    )}">
    <input type="hidden" name="quantity_${index}" value="${
      cartItem.quantity
    }">`;
  });

  paypalHTMLForm += `<input type="submit" value="PayPal" class="paypal">
  </form><div class="overlay">Please wait...</div>`;
  document
    .querySelector("body")
    .insertAdjacentHTML("beforeend", paypalHTMLForm);
  document.getElementById("paypal-form").submit();
}

//slide code
let product_prefab = function (data, placement, position, address) {
  return `<div class="product_container_slide" style="right:-${placement}%;position:${position}">
    <div class="product" id="${data.id} ">
      <img src="${data.img}" alt="" />
      <div class="desc d-flex flex-column p-4 justify-content-between">
        <div class="name pdT">
          <p>Name :</p>
          <p class="pDetail">${data.name}</p>
        </div>
        <div class="cost pdT">
          <p>Cost :</p>
          <p class="pDetail">${data.price}</p>
        </div>
        <div class="stock pdT">
          <p>Stock :</p>
          <p class="pDetail">${data.stock}</p>
        </div>
      </div>

      <article class="detailed_desc">
      ${data.desc}
      </article>
    </div>
  </div>`;
};

let featured = [
  {
    id: "0",
    name: "saddoge",
    price: "20?",
    stock: "Infinite",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nihil vel ab similique iure? Quos sequi, sint et ipsa dicta provident suscipit fugit nobis quidem. Incidunt libero nobis distinctio eveniet.  ",
    img: "./Gun.jpg",
  },
  {
    id: "1",
    name: "saddoge",
    price: "20?",
    stock: "Infinite",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nihil vel ab similique iure? Quos sequi, sint et ipsa dicta provident suscipit fugit nobis quidem. Incidunt libero nobis distinctio eveniet.  ",
    img: "./Gun1.jpg",
  },
  {
    id: "2",
    name: "saddoge",
    price: "20?",
    stock: "Infinite",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nihil vel ab similique iure? Quos sequi, sint et ipsa dicta provident suscipit fugit nobis quidem. Incidunt libero nobis distinctio eveniet.  ",
    img: "./Gun2.jpg",
  },
  {
    id: "3",
    name: "saddoge",
    price: "20?",
    stock: "Infinite",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nihil vel ab similique iure? Quos sequi, sint et ipsa dicta provident suscipit fugit nobis quidem. Incidunt libero nobis distinctio eveniet.  ",
    img: "./Gun3.jpg",
  },
];

let slideCont01 = document.querySelector(`.product_slider`);

let PageNo = document.querySelector(".page_no");
let circles;

let pageLogics = {
  lastFeatureItem: 0,
  dispositionFactor: 100,
};

let slideTrackers = [];

populateContainer(featured, slideCont01, 100, "absolute", "buy");

initiateSlides(
  { disposition: 0, track: 0 },
  pageLogics.dispositionFactor,
  7000,
  featured.length,
  slideCont01
);

function populateContainer(collection, containerRef, factor, position, type) {
  for (let i = 0; i < collection.length; i++) {
    containerRef.innerHTML += product_prefab(
      collection[i],
      i * factor,
      position,
      type
    );

    if (containerRef === slideCont01)
      PageNo.innerHTML += `<div class="circle" data-serial="fc${collection[i].id}"></div>`;
  }
  circles = document.querySelectorAll(".circle");
}

function initiateSlides(
  slideData,
  disposition,
  interval,
  collectionRef,
  containerRef
) {
  slideTrackers.push(
    setInterval(() => {
      slideData.track++;

      if (slideData.track >= collectionRef) {
        slideData.track = 0;
        slideData.disposition = -disposition;
      }

      if (interval >= 6000) {
        featuredAnimation(slideData.track);
      }

      dispositionProduct(slideData.disposition, disposition, containerRef);
    }, interval)
  );
}

function dispositionProduct(dispositionData, disposition, containerRef) {
  containerRef.style = `transform:translateX(${-(dispositionData +=
    disposition)}%)`;
}

function featuredAnimation(command) {
  let last;
  let referenceArr = circles;
  let length = referenceArr.length;

  if (command !== undefined) {
    pageLogics.lastFeatureItem = last = command;
  } else {
    pageLogics.lastFeatureItem += 1;
    last = pageLogics.lastFeatureItem;
  }

  if (last > length - 1) {
    last = pageLogics.lastFeatureItem = 0;
  }

  if (last < 0) {
    pageLogics.lastFeatureItem = last = length - 1;
  }

  dispositionProduct(
    pageLogics.dispositionFactor * (last - 1),
    pageLogics.dispositionFactor,
    slideCont01
  );

  referenceArr[last].style = `background-color: rgba(102, 102, 102, 0.897);`;

  for (let i = 0; i < length; i++) {
    if (i !== last) {
      referenceArr[i].style = ``;
    }
  }

  clearInterval(slideTrackers[0]);
  slideTrackers = [];
  initiateSlides(
    {
      disposition: pageLogics.dispositionFactor * pageLogics.lastFeatureItem,
      track: pageLogics.lastFeatureItem,
    },
    pageLogics.dispositionFactor,
    7000,
    featured.length,
    slideCont01
  );
}

document.addEventListener("click", (e) => {
  let target = e.target;
  let targetClass = target.className;

  if (targetClass.includes("feature_card") || targetClass.includes("circle")) {
    let id = +target.dataset.serial.match(/(\d+)/)[0];

    featuredAnimation(id);
  }
});

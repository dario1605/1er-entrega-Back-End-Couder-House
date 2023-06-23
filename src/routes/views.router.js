import { Router } from "express";
import { productManager } from "../controllers/ProductManager.js";

const router = Router();

const allProducts = await productManager.getProducts();

router.get("/", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    res.render("home", { allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    res.render("realTimeProducts", { allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
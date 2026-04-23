import React from "react";
import Hero from "../components/Hero";
import BentoGrid from "../components/BentoGrid";
import Archive from "../components/Archive";

const Home = ({ products, featured, onOpen, likedSet }) => {
    return (
        <>
            <Hero total={products.length} />
            <BentoGrid products={featured} onOpen={onOpen} />
            <Archive products={products} onOpen={onOpen} likedSet={likedSet} />
        </>
    );
};

export default Home;

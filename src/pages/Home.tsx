import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Process from '../components/Process';

const Home: React.FC = () => {
    return (
        <main>
            <Hero />
            <Process />
            <Features />
        </main>
    );
};

export default Home;

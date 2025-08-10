import FilterBar from "./components/FilterBar";
import LogResults from "./components/LogResults";

function App() {
  return (
    // <ModalContextProvider>
    //   <MobileMenuContextProvider>
    //     <Page>
    //       <Header>
    //         <Navigation />
    //         <Hero />
    //         <Reviews />
    //       </Header>
    //       <Main>
    //         <Logos />
    //         <Features />
    //         <FAQs />
    //         <Testimonials />
    //       </Main>
    //       <Footer />

    //       <Modal modal="sign-up">
    //         <SignUpModal />
    //       </Modal>

    //       <MobileMenu />
    //     </Page>
    //   </MobileMenuContextProvider>
    // </ModalContextProvider>
    <div className="container mx-auto p-4">
      <FilterBar />
      <LogResults />
    </div>
  );
}

export default App;

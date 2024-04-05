import SNeNameSearch from "../components/OptionsComponent/SNeNameSearch";
import TypeSearch from "../components/OptionsComponent/TypeSearch";
import OptionsComponent from "../components/OptionsComponent/OptionsComponent";

const Home: React.FC = () => {
  return (
    <div>
      <SNeNameSearch />
      <TypeSearch />
      <OptionsComponent />
    </div>
  );
};

export default Home;
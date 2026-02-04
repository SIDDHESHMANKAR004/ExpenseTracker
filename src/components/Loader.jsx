import "./loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <svg viewBox="25 25 50 50" className="loader-svg">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export default Loader;

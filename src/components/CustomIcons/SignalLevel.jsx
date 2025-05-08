const getLevel = (count) => {
  if (count >= 1000) return 4;
  if (count >= 100) return 3;
  if (count >= 10) return 2;
  if (count > 0) return 1;
  return 0;
};

const green = "#4caf50";
const gray = "#bdbdbd";

const SignalLevel = ({ count }) => {
  const level = getLevel(count);
  return (
    <svg width="22" height="22" viewBox="0 0 32 24">
      <rect
        x="2"
        y="16"
        width="6"
        height="6"
        rx="1"
        fill={level >= 1 ? green : gray}
      />
      <rect
        x="10"
        y="10"
        width="6"
        height="12"
        rx="1"
        fill={level >= 2 ? green : gray}
      />
      <rect
        x="18"
        y="4"
        width="6"
        height="18"
        rx="1"
        fill={level >= 3 ? green : gray}
      />
      <rect
        x="26"
        y="0"
        width="6"
        height="22"
        rx="1"
        fill={level >= 4 ? green : gray}
      />
    </svg>
  );
};

export default SignalLevel;

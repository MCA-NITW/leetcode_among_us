const ProfileCard = ({ data, rank }) => {
  const { name, contestRating, contestRanking } = data;
  return (
    <div className="profile-row">
      <div>{rank}</div>
      <div>{name}</div>
      <div>{contestRating}</div>
      <div>{contestRanking}</div>
    </div>
  );
};

export default ProfileCard;

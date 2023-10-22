const ProfileCard = ({ data, rank }) => {
    const name = data.name;
    const contest = data.userContestRanking;
    return (
      <div className="profile-row">
        <div>{rank}</div>
        <div>{name}</div>
        <div>{Math.round(contest.rating)}</div>
        <div>
          {contest.globalRanking}/{contest.totalParticipants}
        </div>
      </div>
    );
  };

export default ProfileCard;
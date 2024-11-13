import { Link } from "react-router-dom";
import { useGetOwnerQuery, usePayMemberDropsMutation } from "./ownerSlice";

import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();
  const [payMemberDrops] = usePayMemberDropsMutation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handlePayout = async (memberId) => {
    try {
      await payMemberDrops(memberId).unwrap();
      console.log(`Paid out drops for member with ID: ${memberId}`);
    } catch (e) {
      console.error("Error paying out drop:", err);
    }
  };

  // map out the team members and show a list of their current drops, create a form to pay drops which them with change the paid boolean expression to true
  function BusinessMembersCard() {
    return (
      <section>
        <h2>Your Team Members</h2>
        {owner?.ownerBusiness?.length ? (
          owner.ownerBusiness.map((business) => (
            <div key={business.id}>
              <h3>{business.businessName}</h3>
              <ul>
                {business.businessMember?.length ? (
                  business.businessMember.map((member) => {
                    const unpaidDrops = member.drop?.filter(
                      (drop) => !drop.paid
                    );
                    const allPaid = unpaidDrops.length === 0;

                    return (
                      <li key={member.id}>
                        <p>{member.memberName}</p>
                        <div>
                          {unpaidDrops.length
                            ? unpaidDrops.map((drop) => (
                                <Link
                                  to={`/memberdrop/${drop.id}`}
                                  key={drop.id}
                                >
                                  {new Date(drop.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      timeZone: "UTC",
                                    }
                                  )}
                                </Link>
                              ))
                            : " "}
                        </div>
                        <p>Owed: ${member.totalOwe}</p>
                        {allPaid ? (
                          <p>All drop payments up to date</p>
                        ) : (
                          <p>Pay: ${member.totalOwed}</p>
                        )}
                        <button onClick={() => handlePayout(member.id)}>
                          Payout Team Member
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <p>No team members for this business.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No businesses found.</p>
        )}
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <p>Username: {owner?.username}</p>
      <p>Owner Name: {owner?.ownerName}</p>
      <p>Take Home Total: ${owner?.takeHomeTotal}</p>
      <BusinessMembersCard />
      <Link to={`/memberarchive`}>*Member Archive*</Link>
      <Link to={`/ownerhandledrops`}>
        *Pay Balance for each member that has current drops functionality has
        been created but we also need to send the member a notifcation*
      </Link>
      <h3>Year Take Home Total:</h3>
      {/*possibly in graph form*/}
      <h3>Monthly Totals: *list totals*</h3>
    </article>
  );
}

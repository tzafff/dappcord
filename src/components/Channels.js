import Swal from "sweetalert2";

const Channels = ({
  provider,
  account,
  dappcord,
  channels,
  currentChannel,
  setCurrentChannel,
}) => {
  const channelHandler = async (channel) => {
    const hasJoined = await dappcord.hasJoined(channel.id.toString(), account);
    if (hasJoined) {
      setCurrentChannel(channel);
    } else {
      try {
        console.log("first")
        const signer = await provider.getSigner();
        const transaction = await dappcord
          .connect(signer)
          .mint(channel.id, { value: channel.cost });
        await transaction.wait();
        setCurrentChannel(channel);
        Swal.fire({
          title: "Joining Channel!",
          text: "Successfully Joined Channel",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        if (error.message.includes("insufficient funds")) {
          // Display a customized error message for insufficient funds using SweetAlert2
          Swal.fire({
            title: "Insufficient Funds",
            text: "You do not have enough funds to complete the transaction.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          // Display a generic error message for other errors using SweetAlert2
          Swal.fire({
            title: "Error",
            text: "An error occurred while processing your request. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              onClick={() => channelHandler(channel)}
              key={index}
              className={
                currentChannel &&
                currentChannel.id.toString() === channel.id.toString()
                  ? "active"
                  : ""
              }
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Channels;

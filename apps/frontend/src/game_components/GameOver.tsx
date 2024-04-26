import React, { useEffect, useState } from "react";
import { breakoutHighScore } from "common/src/backend_interfaces/breakoutHighScore.js";
import axios from "axios";
import { Button, Tabs, Tab, TextField, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import styles from "../styles/brighamBreakout.module.css";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
  // return ( <>
  //       {index === 0 ? <>
  //       <div>
  //         <h1>hi</h1>
  //       </div>
  //       </> : <>
  //         <div>
  //           <h1>guy</h1>
  //         </div>
  //       </>}
  //     </>
  // );
}

const GameOver = () => {
  // const [hovering, setHovering] = useState(false);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const endTime: string | null = params.get("endTime");

  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const gameOverContainer: React.CSSProperties = {
    height: "100vh",
    background:
      "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/backgroundCancerGame.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "white",
  };

  const highScoreContainer: React.CSSProperties = {
    backgroundColor: "black",
    opacity: ".8",
    color: "white",
    height: "90vh",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const leaveButton = {
    fontFamily: "'Halogen by Pixel Surplus', sans-serif",
    fontSize: "3rem",
    backgroundColor: "#567829", //"#012D5A",
    justifyContent: "center",
    color: "white",
    borderRadius: 0,
    transition: "background-color 0.3s", // Add transition for smooth effect
  };
  //
  // const leaveButtonHover = {
  //     backgroundColor: "#428fdd", // Background color on hover
  // };

  const [formData, setFormData] = useState<breakoutHighScore>({
    HSID: 0,
    initial: "",
    time: endTime ? endTime : "",
  });
  const [highScores, setHighScores] = useState<breakoutHighScore[]>([]);
  const [recentScores, setRecentScores] = useState<breakoutHighScore[]>([]);

  const fetchTop = async () => {
    try {
      const response = await axios.get("/api/hs-all-time");
      const highscores = response.data;
      setHighScores(highscores);
    } catch (error) {
      console.log("ERROR");
    }
  };

  const fetchRecent = async () => {
    try {
      const response = await axios.get("/api/hs-today");
      const highscores = response.data;
      setRecentScores(highscores);
    } catch (error) {
      console.log("ERROR");
    }
  };

  useEffect(() => {
    fetchTop();
    fetchRecent();
  }, []);

  console.log(highScores);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "initial" && e.target.value.length > 3) {
      return;
    }
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      HSID: 0,
      initial: "",
      time: endTime ? endTime : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/brig-hs-request", formData);
      console.log(response.data);
    } catch (error) {
      console.error("Unable to create form");
      console.log(error);
    }
    resetForm();
    setSubmitted(true);
  };

  return (
    <>
      <div
        id={"gameOverContainer"}
        style={gameOverContainer}
        className={"container-fluid"}
      >
        <div
          id={"highScoreContainer"}
          className={"container"}
          style={highScoreContainer}
        >
          {!submitted ? (
            <>
              <form onSubmit={handleSubmit}>
                <div>End Time: {endTime}</div>
                <TextField
                  id={"initial"}
                  variant={"filled"}
                  label={"Your Initials"}
                  required
                  value={formData.initial}
                  onChange={handleTextFieldChange}
                  InputProps={{
                    style: {
                      backgroundColor: "white",
                    },
                  }}
                />

                <Button type={"submit"}>Click</Button>
              </form>
            </>
          ) : (
            <>
              <Tabs
                value={value}
                onChange={handleChange}
                variant={"fullWidth"}
                className={""}
              >
                <Tab
                  label="All Time High Scores"
                  style={{
                    color: "#fff",
                    border: "1px solid green",
                    borderBottom: "none",
                    borderBottomColor: value === 0 ? "green" : "transparent",
                  }}
                />
                <Tab
                  label="Today's High Scores"
                  style={{
                    color: "#fff",
                    border: "1px solid green",
                    borderBottom: "none",
                    borderBottomColor: value === 1 ? "green" : "transparent",
                  }}
                />
              </Tabs>
              <CustomTabPanel value={value} index={0}>
                <div className={`${styles.highScoreTable}`}>
                  <div>
                    <h2>All Time</h2>
                    <table>
                      <thead>
                        <tr>
                          <th className={`${styles.highScoreTableInitials}`}>
                            Initials
                          </th>
                          <th>Playtime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {highScores.map((score, index) => (
                          <tr key={index}>
                            <td className={styles.highScoreTableInitials}>
                              {score.initial}
                            </td>
                            <td>{score.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className={`${styles.highScoreTable}`}>
                  <div>
                    <h2>Today</h2>
                    <table>
                      <thead>
                        <tr>
                          <th className={`${styles.highScoreTableInitials}`}>
                            Initials
                          </th>
                          <th>Playtime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentScores.map((score, index) => (
                          <tr key={index}>
                            <td className={styles.highScoreTableInitials}>
                              {score.initial}
                            </td>
                            <td>{score.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CustomTabPanel>

              <a
                id="leave"
                style={{ ...leaveButton }} // Merge styles based on hovering state
                className={"btn py-4 px-5 shadow-lg"}
                href={"/public-map"}
              >
                BACK TO MAP
              </a>
              <a
                id="restart"
                style={{ ...leaveButton }} // Merge styles based on hovering state
                className={"btn py-4 px-5 shadow-lg mx-5"}
                href={"/brigham-breakout"}
              >
                TRY AGAIN
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameOver;

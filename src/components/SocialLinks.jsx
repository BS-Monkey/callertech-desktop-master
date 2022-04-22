import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
const electron = window.electron;

const useStyles = makeStyles({
  link: {
    color: "rgb(38, 156, 226)",
    flexGrow: 0,
    width: 28,
    cursor: "pointer",
    backgroundImage: "url('./assets/images/social-icons-28x28.svg')",
    textDecoration: "none",
    display: "inline-block",
    position: "relative",
    height: 28,
    margin: "6px 6px 0px 0px",
  },
});
const SocialLinks = ({ profiles, fbId }) => {
  const classes = useStyles();
  const positions = {
    youtube: "-364px 0px",
    github: "-420px 0px",
    twitter: "-28px 0px",
    instagram: "-392px 0px",
    facebook: "-56px 0px",
    google: "-140px 0px",
    pinterest: "-168px 0px",
    plancast: "-196px 0px",
    aboutme: "-280px 0px",
    angellist: "-84px 0px",
    linkedin: "0px 0px",
    xing: "-1064px 0px",
    quora: "-308px 0px",
    keybase: "-1232px 0px",
    gravatar: "-1092px 0px",
    ycombinator: "-1204px 0px",
    foursquare: "644px 0px",
    owler: "1260px 0px",
    crunchbasecompany: "756px 0px",
    klout: "532px 0px",
    vimeo: "476px 0px",
  };
  const handleClick = (href) => {
    let url = href;
    if (!href.includes("http")) {
      url = `http://${href}`;
    }
    if (electron) electron.shell.openExternal(url);
    else window.open(url);
  };
  const [profileList, setProfile] = useState([]);
  useEffect(() => {
    if (profiles) {
      setProfile(profiles);
    }
    if (fbId) {
      const newProfiles = [
        ...profileList,
        { url: `https://facebook.com/${fbId}` },
      ];
      setProfile(newProfiles);
    }
  }, [profiles, fbId]);
  return (
    <div className="links">
      {profileList.map((profile) => {
        if (Object.keys(positions).includes(profile.service)) {
          return (
            <a
              className={classes.link}
              href={profile.url}
              rel="noopener noreferrer"
              target="_blank"
              style={{ backgroundPosition: positions[profile.service] }}
              onClick={(e) => {
                e.preventDefault();
                handleClick(profile.url);
              }}
              key={profile.service}
            ></a>
          );
        }
        return null;
      })}
    </div>
  );
};
export default SocialLinks;

import React from 'react';
import "./infoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
function InfoBox({title, cases,isRed, active, total, ...props}) {
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} `} /* string interpelation / infoBox--selected --> modified elementl */
             onClick={props.onClick}
            >
            <CardContent>
                { /* Title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`} >{cases}</h2>  { /* Number of cases */}
                    
                <Typography className="infoBox__total">{total} Total</Typography> { /* Total */}

            </CardContent>
        </Card>
    )
}

export default InfoBox

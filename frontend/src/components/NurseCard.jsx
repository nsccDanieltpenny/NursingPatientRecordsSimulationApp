import { useUser } from "../context/UserContext"
import  { useState, useEffect } from 'react'
import axios from "../utils/api"
import { Card, CardContent, CardHeader, CardActions, Button, List,ListItem, ListItemText} from "@mui/material"


export default function NurseCard(){

    const {user} = useUser()
    const [classInfo, setClassInfo] = useState(null);
    console.log(user)

    useEffect(()=>{
        fetchClassInfo()
    }, [])


    const fetchClassInfo = async () =>{
        try {
            const response = await axios.get(`/api/classes/${user.classId}`)
            console.log("Class id response: ", response.data);
            setClassInfo(response.data)
    
        }catch(error){
            console.error(`Error fetching classes/${user.classId}: `, error);
        }

    }

    return(   
        <div className="nurse-card-container">        
           <Card className="nurse-card">

                <CardHeader 
                sx={{ p: 0, paddingLeft: 3, paddingRight: 0, paddingTop: 2 }}
                className="nurse-card-title" 
                title={`Nurse ${user?.fullName}`} />

                <hr className="header-divider"/>

                <CardContent>
                    <div className="list-container" style = {{ display: "flex", flexDirection: "row", height: 'auto', justifyContent: 'center',  gap: "20px" }}>
                        <List disablePadding>
                            <ListItem
                            sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ListItemText primary="Instructor:" primaryTypographyProps={{ fontWeight: "bold", color: 'rgb(20, 78, 250)' }}/>
                                <ListItemText primary={classInfo?.instructor.fullName || "Unknown"}  />
                            </ListItem>
                            
                            <hr className='list-divider'/>
                            
                            <ListItem
                            sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ListItemText primary="Class:"primaryTypographyProps={{ fontWeight: "bold", color: 'rgb(20, 78, 250)' }}  />
                                <ListItemText primary={user?.className || "Unenrolled"} sx={{ textAlign: "" }} />
                            </ListItem>

                            <hr className='list-divider'/>

                            <ListItem
                            sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ListItemText primary="Campus:"primaryTypographyProps={{ fontWeight: "bold", color: 'rgb(20, 78, 250)' }}  />
                                <ListItemText primary={classInfo?.campus.name || "Unknown"} sx={{ textAlign: "right" }} />
                            </ListItem>

                            <hr className='list-divider'/>

                            <ListItem
                            sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <ListItemText primary="Email:" sx={{ flexBasis: "50%" }} primaryTypographyProps={{ fontWeight: "bold", color: 'rgb(20, 78, 250)' }}/>
                                <ListItemText primary={user?.email} sx={{ textAlign: "right" }} />
                            </ListItem>
                        </List>
                    </div>

                    <div className="list-container" style = {{ display: "flex", flexDirection: "row", height: 'auto', minHeight:'10rem', justifyContent: 'center',  gap: "20px", marginTop: '20px' }}>
                        <div>
                            <p> Your Assessments </p>
                        </div>
                    </div>
                    
                    {/* <div className="content-container" style = {{ display: "flex", flexDirection: "row", alignItems:'center', justifyContent: 'center' }}>
                        <CardActions>
                            <Button style ={{backgroundColor: "#d48d30"}} variant="contained" >
                                Reset Password
                            </Button>
                        </CardActions>
                    </div> */}
                </CardContent>

                <p className="nurse-card-footer">If any info appears incorrect, please contact your instructor.</p>
           </Card>
            
            
            
        </div>
 
    )

}


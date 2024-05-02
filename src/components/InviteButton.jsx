import * as React from 'react';  
import Button from '@mui/material/Button';  
import SendIcon from '@mui/icons-material/Send';  
import Stack from '@mui/material/Stack';  
import { FcInvite } from "react-icons/fc";
import { IoAddCircleOutline } from "react-icons/io5";

export default function InviteButton() {  
  return (  
    <Stack direction="row" spacing={2}>  
      <Button variant="contained" endIcon={<IoAddCircleOutline />}>  
        Invite
      </Button>  
    </Stack>  
  );  
}  
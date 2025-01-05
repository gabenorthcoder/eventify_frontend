import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha} from '@mui/material/styles';
import AddressAutocomplete, {
  AddressAutocompleteValue,
} from "mui-address-autocomplete";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  TextareaAutosize,
  FormHelperText,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../Auth/theme/AppTheme";
import ColorModeSelect from "../Auth/theme/ColorModeSelect";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import { EventSchema } from "../../schema/event";
dayjs.locale("en-gb");

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%", 
  padding: theme.spacing(5), 
  gap: theme.spacing(3), 
  marginBottom: "5%",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  borderRadius: "12px", 
  [theme.breakpoints.up("sm")]: {
    width: "600px", 
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const CreateEventContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(4), 
  justifyContent: "center", 
  alignItems: "center", 
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6),
  },
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "0.9rem",
  fontFamily: theme.typography.fontFamily,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.default,
  "&:hover": {
    borderColor: theme.palette.grey[400], 
  },
  "&:focus": {
    borderColor: theme.palette.background.paper, 
    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    outlineOffset: '2px',
  },
  "&.Mui-error": {
    borderColor: theme.palette.error.main, 
    backgroundColor: theme.palette.error.light, 
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground, 
    borderColor: theme.palette.action.disabled, 
  },
}));

export default function CreatEvent(props: { disableCustomTheme?: boolean }) {
  const [titleError, setTitleError] = React.useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = React.useState("");
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = React.useState("");
  const [imageUrlError, setImageUrlError] = React.useState(false);
  const [imageUrlErrorMessage, setImageUrlErrorMessage] = React.useState("");
  const [eventDateError, setEventDateError] = React.useState(false);
  const [eventDateErrorMessage, setEventDateErrorMessage] = React.useState("");
  const [addressError, setAddressError] = React.useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [addressData, setAddressData] =
React.useState<AddressAutocompleteValue | null>(null);
  const [eventDate, setEventDate] = React.useState<Dayjs | null>(dayjs(null));
  const navigate = useNavigate();
  const location = useLocation();
  const pageSource = location.state?.from;
  const token = localStorage.getItem("token") || "";

  const validateInputs = () => {
    const title = document.getElementById("title") as HTMLInputElement;
    const description = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const imageUrl = document.getElementById("imageUrl") as HTMLInputElement;

    let isValid = true;

    if (!title.value || title.value.length < 1) {
      setTitleError(true);
      setTitleErrorMessage("Title is required.");
      isValid = false;
    } else {
      setTitleError(false);
      setTitleErrorMessage("");
    }

    if (!description.value || description.value.length < 1) {
      setDescriptionError(true);
      setDescriptionErrorMessage("Description is required.");
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }

    if (!imageUrl.value || imageUrl.value.length < 1) {
      setImageUrlError(true);
      setImageUrlErrorMessage("Event Image URL is required.");
      isValid = false;
    } else {
      setImageUrlError(false);
      setImageUrlErrorMessage("");
    }

    if (
      !addressData?.formatted_address ||
      addressData?.formatted_address.length < 1
    ) {
      setAddressError(true);
      setAddressErrorMessage("Address is required.");
      isValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage("");
    }

    if (!eventDate || eventDate.toString().length < 1) {
      setEventDateError(true);
      setEventDateErrorMessage("Date is required.");
      isValid = false;
    } else {
      setEventDateError(true);
      setEventDateErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

 
    if (!validateInputs()) {
      return; 
    }

    const data = new FormData(event.currentTarget);
    const validTitle = String(data.get("title"));
    const validDescription = String(data.get("description"));
    const validDate = eventDate?.toISOString();
    const validImageUrl = String(data.get("imageUrl"));
    const validAddress = String(addressData?.formatted_address);

    const eventData: EventSchema = {
      title: validTitle,
      description: validDescription,
      address: validAddress,
      date: validDate!,
      imageUrl: validImageUrl,
    };

    try {
      const registerEvent = await apiService.createEvent(eventData, token);

      setSuccessMessage(registerEvent.message);
      setTimeout(() => {
        navigate(`/${pageSource}/dashboard`);
      }, 2000);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Event Registration Error ${errorMessage}`);
  
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect
        sx={{ position: "fixed", bottom: "5rem", right: "1rem" }}
      />

  
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

  
      {error && <Alert severity="error">{error}</Alert>}

      <CreateEventContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              fontFamily: "apple chancery, cursive",
              textAlign: "center",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
            }}
          >
            Eventify
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            Create Event
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Title</FormLabel>
              <TextField
                autoComplete="title"
                name="title"
                required
                fullWidth
                id="title"
                placeholder="Event Title"
                error={titleError}
                helperText={titleErrorMessage}
                color={titleError ? "error" : "primary"}
                aria-describedby="title-helper-text"
              />
            </FormControl>

            <FormControl fullWidth error={eventDateError}>
              <FormLabel htmlFor="eventDate">Date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                  slotProps={{
                    textField: {
                      placeholder: "Enter Event Date",
                      required: true,
                      fullWidth: true,
                      autoComplete: "off",
                      sx: {
                        "& input::placeholder": { opacity: 1 },
                        "& .MuiInputAdornment-root": {
                          backgroundColor: "transparent",
                          border: "none",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "inherit",
                          backgroundColor: "transparent",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              {eventDateError && (
                <FormHelperText>{eventDateErrorMessage}</FormHelperText>
              )}
            </FormControl>
 <FormControl>
              <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
              <TextField
                autoComplete="imageUrl"
                name="imageUrl"
                required
                fullWidth
                id="imageUrl"
                placeholder="Event Image URL: http://images.com/event.png"
                error={imageUrlError}
                helperText={imageUrlErrorMessage}
                color={imageUrlError ? "error" : "primary"}
                aria-describedby="image-url-helper-text"
              />
            </FormControl>
           
            <FormControl>
              <FormLabel htmlFor="name">Address</FormLabel>
              <AddressAutocomplete
                apiKey="AIzaSyAkmHj4PI-bN5VINXTWcvMfCkr0UdxDPCQ"
                label=""
                value={addressData}
                onChange={(_, value: AddressAutocompleteValue | null) =>
                  setAddressData(value)
                }
                fields={["geometry"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Event Address"
                    autoComplete="address"
                    name="address"
                    required
                    fullWidth
                    id="address"
                    error={addressError}
                    helperText={addressErrorMessage}
                    color={addressError ? "error" : "primary"}
                    aria-describedby="address-helper-text"
                    sx={{
                      "& .MuiAutocomplete-clearIndicator": {
                        border: "none", 
                        backgroundColor: "transparent", 
                      },
                      "& .MuiAutocomplete-popupIndicator": {
                        border: "none", 
                        backgroundColor: "transparent", 
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth error={descriptionError}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <StyledTextarea
                id="description"
                name="description"
                required
                placeholder="Event Description"
                aria-describedby="description-helper-text"
                aria-label="empty textarea"
                minRows={3} 
              />
              <FormHelperText id="description-helper-text">
                {descriptionErrorMessage}
              </FormHelperText>
            </FormControl>



            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Create Event
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}></Box>
        </Card>
      </CreateEventContainer>
    </AppTheme>
  );
}

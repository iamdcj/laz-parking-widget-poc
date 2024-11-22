import { Box, Typography } from "@mui/material";
import React, { memo } from "react";

const EventOption = memo(({ props, option }: { props: any; option: any }) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  } as Intl.DateTimeFormatOptions;

  const formatter = new Intl.DateTimeFormat(
    "en-US",
    options as Intl.DateTimeFormatOptions
  );

  const [month, day, year, hour, minute, dayPeriod] = formatter
    .formatToParts(option.date)
    .filter(({ type }) => type !== "literal");

  const displayDate = {
    month: month.value,
    day: day.value,
    year: year.value,
    hour: hour.value,
    minute: minute.value,
    dayPeriod: dayPeriod.value,
  };

  return (
    <li {...props}>
      <Box display="flex" alignItems="center" gap={1}>
        <Box>
          <Box width={50} textAlign="center">
            <Typography
              sx={{ backgroundColor: "#07254A" }}
              borderRadius="4px 4px 0 0"
              color="#fff"
              fontSize={10}
            >
              {displayDate.year}
            </Typography>
            <Box
              border="1px solid #07254A"
              padding={0.5}
              borderRadius="0 0 4px 4px"
            >
              <Typography
                fontSize={12}
                mb={0}
                lineHeight={1}
                textTransform="uppercase"
              >
                {displayDate.month}
              </Typography>
              <Typography fontSize={16} fontWeight={600} lineHeight={1}>
                {displayDate.day}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography
            display="block"
            fontSize={14}
            fontWeight={600}
            lineHeight={1.1}
            mb={0.5}
          >
            {option.label}
          </Typography>
          <Typography fontSize={12}>
            {displayDate.hour}:{displayDate.minute}
            {displayDate.dayPeriod}
          </Typography>
        </Box>
      </Box>
    </li>
  );
});

export default EventOption;

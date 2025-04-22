


<template>
    <div>
      <PowerBIReportEmbed
        :embedConfig="embedConfig"
        :cssClassName="'reportClass'"
        :phasedEmbedding="false"
        :eventHandlers="eventHandlers"
      />
    </div>
  </template>
  
  <script>
  import * as models from 'powerbi-client';
  import { PowerBIReportEmbed } from 'powerbi-client-vue-js';
  export default {
    data() {
      return {
        embedConfig: this.getEmbedConfig(),
        eventHandlers: new Map([
          ['loaded', () => console.log('Report loaded')],
          ['rendered', () => console.log('Report rendered')],
          ['error', (event) => console.log(event.detail)]
        ])
      };
    },
    methods: {
      getEmbedConfig() {
        
        const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvM2VjMTE0MTEtMmE3MS00YTEyLWFjODAtZmJmOTM1NTNmOTE4LyIsImlhdCI6MTczNzc3ODk1NCwibmJmIjoxNzM3Nzc4OTU0LCJleHAiOjE3Mzc3ODI4NTQsImFpbyI6ImsyUmdZTGorMmREeWNhYkozSFhLZXc3ZWVqdUJGUUE9IiwiYXBwaWQiOiI0NWY5ODQ4YS05ODU1LTRjNzYtODQzZS04ZjFjNmUyOGI2MzciLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zZWMxMTQxMS0yYTcxLTRhMTItYWM4MC1mYmY5MzU1M2Y5MTgvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI3Y2JkOGE2Yy0wMTljLTRmOWEtOWVhNi1mZDZhMDFiZjA2YTIiLCJyaCI6IjEuQVZNQUVSVEJQbkVxRWtxc2dQdjVOVlA1R0FrQUFBQUFBQUFBd0FBQUFBQUFBQURGQUFCVEFBLiIsInN1YiI6IjdjYmQ4YTZjLTAxOWMtNGY5YS05ZWE2LWZkNmEwMWJmMDZhMiIsInRpZCI6IjNlYzExNDExLTJhNzEtNGExMi1hYzgwLWZiZjkzNTUzZjkxOCIsInV0aSI6IjJSakN6OF9BTmtTbkFla1phS1JDQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiI3IDMyIn0.OtapfvJF5skb1QvsmpV1KgrptbYx7P6w-3rgjeq4Ir6hbH1GTIV6co3r9UIR9hTChoriXNeGhWZComn1VsYsa3Vvab7dqGqlvQYed4xA74WFNACs5vwqziUM8Asqs1etJYV6vfqvj5zzclcRW_q9f0CUONhlXV0uysHlLSrXscXSsYQe3eyctUXQieaq1yYgu1mzunJUwcf8RI6KtHBVqYDWliMQUBohfsUTuxv53uDWhvncIfxEMEkxxIoYfXjJ5J6AMH-851fh3n-8qXVq6E2Cn5BxwgIVT2tAPGhvg5Y7T0Eua7dp_cNMiaGZ2RCtl9qPeFJsk-SwgQ9mnh68nA"
  
        return {
          type: 'report',
          id: 'eyJrIjoiMzVjMjEzNTAtM2VkYi00YzdjLWFhYmItZTE0ZjViZWVkZDZjIiwidCI6IjNlYzExNDExLTJhNzEtNGExMi1hYzgwLWZiZjkzNTUzZjkxOCIsImMiOjEwfQ',
          embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMzVjMjEzNTAtM2VkYi00YzdjLWFhYmItZTE0ZjViZWVkZDZjIiwidCI6IjNlYzExNDExLTJhNzEtNGExMi1hYzgwLWZiZjkzNTUzZjkxOCIsImMiOjEwfQ%3D%3D',
          accessToken: accessToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: models.BackgroundType.Transparent,
          }
        };
      },
    }
  };
  </script>

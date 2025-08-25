package com.ans.sdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class LookupResponse {
    private String status;
    private List<AgentResult> results;
    @JsonProperty("total_matches")
    private int totalMatches;
    @JsonProperty("next_page_token")
    private String nextPageToken;

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<AgentResult> getResults() {
        return results;
    }

    public void setResults(List<AgentResult> results) {
        this.results = results;
    }

    public int getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(int totalMatches) {
        this.totalMatches = totalMatches;
    }

    public String getNextPageToken() {
        return nextPageToken;
    }

    public void setNextPageToken(String nextPageToken) {
        this.nextPageToken = nextPageToken;
    }
}

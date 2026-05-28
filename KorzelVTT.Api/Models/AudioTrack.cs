namespace KorzelVTT.Api.Models;

public class AudioTrack
{
    public int Id { get; set; }
    public int CampaignId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Base64Data { get; set; } = string.Empty; 
}
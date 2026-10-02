import matplotlib.pyplot as plt

metrics = ["Accuracy", "Precision", "Recall", "F1 Score"]
values = [98.34, 98.22, 94.57, 96.36]

plt.figure(figsize=(8, 5))
bars = plt.bar(metrics, values, color=["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"])

plt.title("Social Network Spam Detection Model Performance")
plt.ylabel("Score (%)")
plt.ylim(0, 100)

for bar, value in zip(bars, values):
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        value + 1,
        f"{value:.2f}%",
        ha="center"
    )

plt.tight_layout()
plt.savefig("performance_graph.png", dpi=300)
plt.show()
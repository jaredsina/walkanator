# numbers are calculated by an ai but i verified them
import requests
from io import BytesIO
from PIL import Image
import torch
import torchvision.models as models

device = torch.device("cpu")

# Model: ConvNeXt-Base pretrained on ImageNet-1k. Unlike a 24-species demo
# checkpoint, this covers 1000 classes including several hundred animal
# species/subspecies (e.g. 'African elephant', 'dalmatian', 'monarch',
# 'giant panda'), so common animals are actually representable.
# Published ImageNet top-1 is ~84.8%, top-5 ~98.7%.
weights = models.ConvNeXt_Base_Weights.DEFAULT
categories = weights.meta["categories"]

# Species names: class index -> label, e.g. "African elephant".
idx_to_name = {i: name for i, name in enumerate(categories)}

# Load model
model = models.convnext_base(weights=weights)
model.to(device)
model.eval()

transform = weights.transforms()


def load_image(source: str) -> Image.Image:
    """Load a PIL image from a local path or URL, converted to RGB."""
    if source.startswith("http://") or source.startswith("https://"):
        return Image.open(BytesIO(requests.get(source).content)).convert("RGB")
    return Image.open(source).convert("RGB")


image = transform(
    Image.open(
        BytesIO(
            requests.get("https://tse1.explicit.bing.net/th/id/OIP.-B2AvtRrouOpRp7dcGAozAHaE8?r=0&pid=Api").content
        )
    ).convert("RGB")
).unsqueeze(0).to(device)


def predict(img):
    """Predict the top animal species and genus for a preprocessed image."""
    with torch.no_grad():
        logits = model(img.to(device))
        probs = torch.softmax(logits, dim=1)
        top_k = torch.topk(probs, 5)

    idx = top_k.indices[0, 0].item()
    probability = top_k.values[0, 0].item()

    species = idx_to_name[idx]
    genus = species.split()[0]

    return species, genus, probability



def predict_topk(img, k=5):
    """Top-k ``(label, probability)`` predictions, k <= 1000."""
    with torch.no_grad():
        logits = model(img.to(device))
        probs = torch.softmax(logits, dim=1)
        top_k = torch.topk(probs, min(k, probs.shape[1]))
    return [
        (idx_to_name[idx.item()], prob.item())
        for idx, prob in zip(top_k.indices[0], top_k.values[0])
    ]


def predict_pil(pil_image: Image.Image, k=5):
    """Convenience wrapper: PIL image -> top-k ``(label, prob)`` list."""
    tensor = transform(pil_image.convert("RGB")).unsqueeze(0).to(device)
    return predict_topk(tensor, k)


species, genus, probability = predict(image)

print("Species:", species)
print("Genus:", genus)
print("Confidence:", probability)
